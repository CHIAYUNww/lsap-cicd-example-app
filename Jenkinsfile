pipeline {
  agent any

  environment {
    DOCKERHUB_USER  = "chiayun1014"
    IMAGE_NAME      = "myapp"
  }

  stages {
    stage('CI') {
      steps {
        sh '''
          set -e
          node -v
          npm -v
          npm ci || npm install
          npm run lint || true
        '''
      }
    }

    stage('Dev Deploy') {
      when { branch 'dev' }
      steps {
        sh '''
          set -e
          TAG="dev-${BUILD_NUMBER}"
          IMAGE="${DOCKERHUB_USER}/${IMAGE_NAME}:${TAG}"

          docker build -t "${IMAGE}" .
          docker push "${IMAGE}"

          docker rm -f dev-app || true
          docker run -d --name dev-app -p 8081:3000 "${IMAGE}"
          sleep 3
          curl -fsS http://localhost:8081/health
        '''
      }
    }
  }
}
