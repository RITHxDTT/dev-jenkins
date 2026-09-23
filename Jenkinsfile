pipeline {
    agent any

    environment {
        // Docker Hub repository
        DOCKER_IMAGE = 'rithxdtt/dev-jenkins'

        // Every Jenkins build gets a unique Docker tag
        IMAGE_TAG = "${BUILD_NUMBER}"

        // Jenkins Credentials ID
        DOCKER_CREDENTIALS = 'dockerhub-credentials'
    }

    stages {

        // ==========================================
        // 1. CHECKOUT SOURCE CODE
        // ==========================================
        stage('Checkout') {
            steps {
                echo 'Checking out source code from GitHub...'

                checkout scm
            }
        }

        // ==========================================
        // 2. BUILD SPRING BOOT
        // ==========================================
        stage('Build') {
            steps {
                echo 'Building Spring Boot application...'

                sh '''
                    chmod +x gradlew
                    ./gradlew clean classes
                '''
            }
        }

        // ==========================================
        // 3. RUN TESTS
        // ==========================================
        stage('Test') {
            steps {
                echo 'Running tests...'

                sh '''
                    ./gradlew test
                '''
            }
        }

        // ==========================================
        // 4. PACKAGE APPLICATION
        // ==========================================
        stage('Package') {
            steps {
                echo 'Creating Spring Boot JAR...'

                sh '''
                    ./gradlew bootJar -x test
                '''
            }
        }

        // ==========================================
        // 5. BUILD DOCKER IMAGE
        // ==========================================
        stage('Docker Build') {
            steps {
                echo "Building Docker image..."
                echo "Image: ${DOCKER_IMAGE}:${IMAGE_TAG}"

                sh '''
                    docker build \
                        -t ${DOCKER_IMAGE}:${IMAGE_TAG} \
                        .
                '''
            }
        }

        // ==========================================
        // 6. LOGIN & PUSH TO DOCKER HUB
        // ==========================================
        stage('Docker Push') {
            steps {
                echo 'Logging into Docker Hub...'

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

                        echo "Pushing Docker image..."

                        docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                    '''
                }
            }
        }

        // ==========================================
        // 7. VERIFY
        // ==========================================
        stage('Verify') {
            steps {
                echo 'CI pipeline completed successfully.'
                echo "Docker image: ${DOCKER_IMAGE}:${IMAGE_TAG}"
            }
        }
    }

    // ==============================================
    // AFTER PIPELINE
    // ==============================================
    post {

        success {
            echo '=========================================='
            echo '        CI PIPELINE SUCCESS'
            echo '=========================================='
            echo "Build Number: ${BUILD_NUMBER}"
            echo "Docker Image: ${DOCKER_IMAGE}:${IMAGE_TAG}"
            echo 'Image pushed successfully to Docker Hub.'
            echo '=========================================='
        }

        failure {
            echo '=========================================='
            echo '         CI PIPELINE FAILED'
            echo '=========================================='
            echo "Build Number: ${BUILD_NUMBER}"
            echo 'Check Jenkins Console Output for details.'
            echo '=========================================='
        }

        always {
            echo 'Cleaning Jenkins workspace...'

            deleteDir()
        }
    }
}