import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { RealDataService } from "./realDataService";
import { evaluateAllRules, executeActiveRules, type ControlAction } from "./fuzzyLogic";
import type { DashboardState, ChartDataPoint } from "@shared/types";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: '/fneeo-ws'
  });

  const realDataService = new RealDataService("Unknown Location", 51.5074, -0.1278);
  const controlActionsHistory: ControlAction[] = [];
  const temperatureHistory: ChartDataPoint[] = [];
  const pollutionHistory: ChartDataPoint[] = [];
  const energyHistory: ChartDataPoint[] = [];

  const zones = [
    { id: "1", name: "Sector 1", status: "optimal" as const, temperature: 24, pollution: 35, traffic: 45 },
    { id: "2", name: "Sector 2", status: "optimal" as const, temperature: 25, pollution: 40, traffic: 50 },
    { id: "3", name: "Sector 3", status: "warning" as const, temperature: 28, pollution: 75, traffic: 65 },
    { id: "4", name: "Sector 4", status: "optimal" as const, temperature: 23, pollution: 30, traffic: 40 },
    { id: "5", name: "Sector 5", status: "critical" as const, temperature: 32, pollution: 95, traffic: 85 },
    { id: "6", name: "Sector 6", status: "warning" as const, temperature: 27, pollution: 68, traffic: 70 },
  ];

  function updateHistoricalData(data: any) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    temperatureHistory.push({ time: timeStr, value: Math.round(data.temperature * 10) / 10 });
    pollutionHistory.push({ time: timeStr, value: Math.round(data.pm25) });
    energyHistory.push({ time: timeStr, value: Math.round(data.energy) });

    if (temperatureHistory.length > 24) temperatureHistory.shift();
    if (pollutionHistory.length > 24) pollutionHistory.shift();
    if (energyHistory.length > 24) energyHistory.shift();
  }

  function updateZones(data: any) {
    zones.forEach(zone => {
      const variance = Math.random() * 0.2 - 0.1;
      zone.temperature = Math.round((data.temperature * (1 + variance)) * 10) / 10;
      zone.pollution = Math.round(data.pm25 * (1 + variance));
      zone.traffic = Math.round(data.traffic * (1 + variance));
      
      if (zone.temperature > 30 || zone.pollution > 80) {
        zone.status = "critical";
      } else if (zone.temperature > 27 || zone.pollution > 60) {
        zone.status = "warning";
      } else {
        zone.status = "optimal";
      }
    });
  }

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to FNEEO system');

    const interval = setInterval(async () => {
      try {
        const currentData = await realDataService.generateData();
        const fuzzyRules = evaluateAllRules(currentData);
        const newActions = executeActiveRules(currentData);

        // Debug: Log environmental data and active rules
        const activeRules = fuzzyRules.filter(r => r.isActive);
        if (activeRules.length > 0) {
          console.log(`📊 Active rules: ${activeRules.map(r => r.id).join(', ')}`);
        }

        if (newActions.length > 0) {
          console.log(`🎯 ${newActions.length} control action(s) triggered:`);
          newActions.forEach(action => {
            console.log(`   → ${action.action}`);
            controlActionsHistory.unshift(action);
          });
        }

        if (controlActionsHistory.length > 20) {
          controlActionsHistory.splice(20);
        }

        updateHistoricalData(currentData);
        updateZones(currentData);

        const state: DashboardState = {
          currentData,
          fuzzyRules,
          controlActions: controlActionsHistory,
          zones,
          temperatureHistory: [...temperatureHistory],
          pollutionHistory: [...pollutionHistory],
          energyHistory: [...energyHistory]
        };

        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(state));
        }
      } catch (error) {
        console.error('Error generating real data:', error);
      }
    }, 2000);

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'updateLocation') {
          realDataService.setZone(data.zone || 'Unknown Location');
          // Update location coordinates if provided
          if (data.latitude !== undefined && data.longitude !== undefined) {
            realDataService.setLocation(
              data.zone || 'Unknown Location',
              data.latitude,
              data.longitude
            );
          }
        }
        
        if (data.type === 'updateConditions') {
          realDataService.updateBaseConditions(
            data.temperature || 25,
            data.pollution || 45
          );
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });

    ws.on('close', () => {
      clearInterval(interval);
      console.log('Client disconnected from FNEEO system');
    });
  });

  return httpServer;
}
