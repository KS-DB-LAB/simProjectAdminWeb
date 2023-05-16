node {
  stage('========== Clone repository ==========') {
    checkout scm
  }
  stage('========== Build image ==========') {
    agent any
    steps {
      sh 'docker build -t handawoon/saile-admin:latest .'
    }
  }
  stage('========== Push image ==========') {
    agent any
      steps {
      	withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'dockerHubPassword', usernameVariable: 'dockerHubUser')]) {
        	sh "docker login -u ${env.dockerHubUser} -p ${env.dockerHubPassword}"
          sh 'docker push handawoon/saile-admin:latest'
        }
      }
  }
}
