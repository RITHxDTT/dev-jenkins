pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'rithxdtt/dev-jenkins'
        IMAGE_TAG = "${BUILD_NUMBER}"
        DOCKER_CREDENTIALS = 'dockerhub-credentials'
    }

    stages {

        // ==========================================
        // 1. CHECKOUT
        // ==========================================
        stage('Checkout') {
            steps {
                echo 'Checking out Next.js source code...'
                checkout scm
            }
        }

        // ==========================================
        // 2. INSTALL DEPENDENCIES
        // ==========================================
        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'

                sh '''
                    npm ci
                '''
            }
        }

        // ==========================================
        // 3. LINT
        // ==========================================
        stage('Lint') {
            steps {
                echo 'Running lint...'

                sh '''
                    npm run lint
                '''
            }
        }

        // ==========================================
        // 4. BUILD NEXT.JS
        // ==========================================
        stage('Build') {
            steps {
                echo 'Building Next.js application...'

                sh '''
                    npm run build
                '''
            }
        }

        // ==========================================
        // 5. BUILD DOCKER IMAGE
        // ==========================================
        stage('Docker Build') {
            steps {
                echo "Building ${DOCKER_IMAGE}:${IMAGE_TAG}..."

                sh '''
                    docker build \
                        -t ${DOCKER_IMAGE}:${IMAGE_TAG} \
                        .
                '''
            }
        }

        // ==========================================
        // 6. PUSH TO DOCKER HUB
        // ==========================================
        stage('Docker Push') {
            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: "${DOCKER_CREDENTIALS}",
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {

                    sh '''
                        echo "$DOCKER_PASSWORD" | \
                        docker login \
                        -u "$DOCKER_USERNAME" \
                        --password-stdin

                        docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                    '''
                }
            }
        }
    }

    post {

        success {
            echo '===================================='
            echo 'CI PIPELINE SUCCESS'
            echo "Image: ${DOCKER_IMAGE}:${IMAGE_TAG}"
            echo '===================================='
        }

        failure {
            echo '===================================='
            echo 'CI PIPELINE FAILED'
            echo "Build: ${BUILD_NUMBER}"
            echo '===================================='
        }

        always {
            echo 'Cleaning workspace...'
            deleteDir()
        }
    }
}