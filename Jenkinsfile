pipeline {
    agent any
        
    environment {
        DOCKER_IMAGE = 'lsap-app-dev'
        CONTAINER_NAME = 'lsap-app-dev'
        HOST_PORT = '8081'
        CONTAINER_PORT = '8081'
    }
    
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} ."
                    sh "docker tag ${DOCKER_IMAGE}:${BUILD_NUMBER} ${DOCKER_IMAGE}:latest"
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    // 停止並移除舊容器
                    sh """
                        docker stop ${CONTAINER_NAME} || true
                        docker rm ${CONTAINER_NAME} || true
                    """
                    
                    // 啟動新容器
                    sh """
                        docker run -d \
                            --name ${CONTAINER_NAME} \
                            -p ${HOST_PORT}:${CONTAINER_PORT} \
                            ${DOCKER_IMAGE}:latest
                    """
                    
                    // 等待容器啟動
                    sh 'sleep 5'
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    sh """
                        curl -f http://localhost:${HOST_PORT}/health || exit 1
                    """
                }
            }
        }
    }
    
    post {
        failure {
            script {
                // 如果失敗，清理容器
                sh "docker stop ${CONTAINER_NAME} || true"
                sh "docker rm ${CONTAINER_NAME} || true"
            }
        }
    }
}
