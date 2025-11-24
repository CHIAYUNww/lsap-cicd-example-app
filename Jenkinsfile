pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS-LTS'  // 使用你在 Jenkins 設定的 NodeJS 名稱
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
    }
    
    post {
	success {
		echo 'Pipeline completed successfully!'
	}
	failure {
		echo 'Pipeline failed!'
	}
    }
}
