import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { RealDataService } from "./realDataService";
import { evaluateAllRules, executeActiveRules, type ControlAction } from "./fuzzyLogic";
import type { DashboardState, ChartDataPoint, ZoneStatus } from "@shared/types";

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

  function generateGPSBasedZones(centerLat: number, centerLng: number, count: number = 6): ZoneStatus[] {
    const zones: ZoneStatus[] = [];
    const radius = 0.05;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI;
      const distance = radius * (0.7 + Math.random() * 0.6);
      const lat = centerLat + distance * Math.cos(angle);
      const lng = centerLng + distance * Math.sin(angle);
      
      zones.push({
        id: String(i + 1),
        name: `Zone ${i + 1}`,
        status: "optimal",
        temperature: 25,
        pollution: 35,
        traffic: 45,
        latitude: lat,
        longitude: lng
      });
    }
    
    return zones;
  }

  let zones = generateGPSBasedZones(51.5074, -0.1278);

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
          if (data.latitude !== undefined && data.longitude !== undefined) {
            realDataService.setLocation(
              data.zone || 'Unknown Location',
              data.latitude,
              data.longitude
            );
            zones = generateGPSBasedZones(data.latitude, data.longitude);
            console.log(`🗺️  Regenerated zones around ${data.zone} (${data.latitude}, ${data.longitude})`);
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
