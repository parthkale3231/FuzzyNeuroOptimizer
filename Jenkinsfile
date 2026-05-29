pipeline {

 
agent any

environment {
    DOCKER_IMAGE = "parth22420166/fuzzyneurooptimizer"
    IMAGE_TAG = "v1"
    DOCKER_BUILDKIT = "1"
}

options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '10'))
}

stages {

    stage('Checkout') {
        steps {
            checkout scm
        }
    }

    stage('Install Dependencies') {
        steps {
            sh '''
            npm ci
            '''
        }
    }

    stage('Build Application') {
        steps {
            sh '''
            npm run build
            '''
        }
    }

    stage('SonarQube Analysis') {
        steps {
            withSonarQubeEnv('SonarQube') {

                sh '''
                sonar-scanner \
                -Dsonar.projectKey=fuzzy-neuro-optimizer \
                -Dsonar.projectName=FuzzyNeuroOptimizer
                '''
            }
        }
    }

    stage('Quality Gate') {
        steps {
            timeout(time: 5, unit: 'MINUTES') {
                waitForQualityGate abortPipeline: true
            }
        }
    }

    stage('Trivy Filesystem Scan') {
        steps {
            sh '''
            mkdir -p reports

            trivy fs . \
            --severity HIGH,CRITICAL \
            --format json \
            --output reports/trivy-fs-report.json
            '''
        }
    }

    stage('Docker Build') {
        steps {
            sh '''
            docker build \
            -t $DOCKER_IMAGE:$IMAGE_TAG \
            -t $DOCKER_IMAGE:latest \
            .
            '''
        }
    }

    stage('Trivy Image Scan') {
        steps {
            sh '''
            trivy image \
            --severity HIGH,CRITICAL \
            --format json \
            --output reports/trivy-image-report.json \
            $DOCKER_IMAGE:$IMAGE_TAG
            '''
        }
    }

    stage('Docker Login') {
        steps {

            withCredentials([
                usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PAT'
                )
            ]) {

                sh '''
                echo $DOCKER_PAT | docker login \
                -u $DOCKER_USER \
                --password-stdin
                '''
            }
        }
    }

    stage('Docker Push') {
        steps {
            sh '''
            docker push $DOCKER_IMAGE:$IMAGE_TAG
            docker push $DOCKER_IMAGE:latest
            '''
        }
    }

    stage('Deploy To Kubernetes') {
        steps {

            sh '''
            kubectl apply -f k8s/deployment.yaml
            kubectl apply -f k8s/service.yaml
            kubectl apply -f k8s/hpa.yaml

            kubectl rollout status deployment/fuzzyneurooptimizer --timeout=180s
            '''
        }
    }

    stage('Verify Deployment') {
        steps {

            sh '''
            kubectl get deployments
            kubectl get pods
            kubectl get svc
            '''
        }
    }

    stage('OWASP ZAP Baseline Scan') {
        steps {

            sh '''
            docker run --rm \
            -v $(pwd)/reports:/zap/wrk \
            ghcr.io/zaproxy/zaproxy:stable \
            zap-baseline.py \
            -t http://host.minikube.internal:30080 \
            -r zap-report.html \
            -I || true
            '''
        }
    }
}

post {

    always {

        archiveArtifacts(
            artifacts: 'reports/**/*',
            allowEmptyArchive: true
        )

    }

    success {
        echo 'DevSecOps Pipeline Completed Successfully'
    }

    failure {
        echo 'Pipeline Failed'
    }
}
 

}
