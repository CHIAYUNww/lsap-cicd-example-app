pipeline {
  agent any

  environment {
    DOCKERHUB_USER = "chiayun1014"
    IMAGE_NAME = "myapp"
    DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1452629790094790727/u8ljuViP6OlaDJgQArqSkjpqLg3XmYdNcjmMOfdKZb49-rxlWN1NrVqUrszWW8tggGyP"
  }

  stages {

    stage('Static Analysis') {
      steps {
        sh '''
          set -e
          node -v
          npm -v
          npm ci
          npm run lint
        '''
      }
    }

    stage('Dev - Build & Deploy') {
      when {
        branch 'dev'
      }
      steps {
        sh '''
        set -e
        docker build -t $DOCKERHUB_USER/$IMAGE_NAME:dev-$BUILD_NUMBER .
        docker push $DOCKERHUB_USER/$IMAGE_NAME:dev-$BUILD_NUMBER

        docker rm -f dev-app || true
        docker run -d --name dev-app -p 8081:3000 \
          $DOCKERHUB_USER/$IMAGE_NAME:dev-$BUILD_NUMBER

        sleep 5
        curl http://localhost:8081/health
        '''
      }
    }

    stage('Prod - GitOps Deploy') {
      when {
        branch 'main'
      }
      steps {
        sh '''
        TARGET_TAG=$(cat deploy.config)

        docker pull $DOCKERHUB_USER/$IMAGE_NAME:$TARGET_TAG
        docker tag $DOCKERHUB_USER/$IMAGE_NAME:$TARGET_TAG \
                   $DOCKERHUB_USER/$IMAGE_NAME:prod-$BUILD_NUMBER
        docker push $DOCKERHUB_USER/$IMAGE_NAME:prod-$BUILD_NUMBER

        docker rm -f prod-app || true
        docker run -d --name prod-app -p 8082:3000 \
          $DOCKERHUB_USER/$IMAGE_NAME:prod-$BUILD_NUMBER
        '''
      }
    }
  }

  post {
    failure {
      sh """
      set +e
      curl -H 'Content-Type: application/json' \
      -d '{
        "content": "CI/CD Failed\\nName: 吳佳芸\\nStudent ID: R13725050\\nJob: $JOB_NAME\\nBuild: $BUILD_NUMBER\\nRepo: $GIT_URL\\nBranch: $BRANCH_NAME\\nStatus: $currentBuild.currentResult"
      }' \
      $DISCORD_WEBHOOK
      """
    }
  }
}
