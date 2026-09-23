pipeline {
    agent any

    // =========================================================
    // TOOLS
    // =========================================================
    // Requires Jenkins NodeJS Plugin.
    // Manage Jenkins -> Tools -> NodeJS installations
    // Name must be exactly: node-22
    tools {
        nodejs 'node-22'
    }

    // =========================================================
    // ENVIRONMENT VARIABLES
    // =========================================================
    environment {

        // Docker Hub repository
        DOCKER_IMAGE = 'idkisme/dev-homework'

       
        IMAGE_TAG = "${BUILD_NUMBER}"

        // Jenkins credential ID
        DOCKER_CREDENTIALS = 'dockerhub-credentials'
    }

    stages {

        // =====================================================
        // 1. VERIFY ENVIRONMENT
        // =====================================================
        stage('Verify Environment') {
            steps {
                echo 'Checking build environment...'

                sh '''
                    echo "Node version:"
                    node --version

                    echo "NPM version:"
                    npm --version

                    echo "Git version:"
                    git --version
                '''
            }
        }

        // =====================================================
        // 2. INSTALL DEPENDENCIES
        // =====================================================
        stage('Install Dependencies') {
            steps {
                echo 'Installing Next.js dependencies...'

                sh '''
                    npm ci
                '''
            }
        }

        // =====================================================
        // 3. LINT
        // =====================================================
        stage('Lint') {
            steps {
                echo 'Running ESLint...'

                sh '''
                    npm run lint
                '''
            }
        }

        // =====================================================
        // 4. BUILD NEXT.JS
        // =====================================================
        stage('Build') {
            steps {
                echo 'Building Next.js application...'

                sh '''
                    npm run build
                '''
            }
        }

        // =====================================================
        // 5. BUILD DOCKER IMAGE
        // =====================================================
        stage('Docker Build') {
            steps {
                echo 'Building Docker image...'
                echo "Image: ${DOCKER_IMAGE}:${IMAGE_TAG}"

                sh '''
                    docker build \
                        -t ${DOCKER_IMAGE}:${IMAGE_TAG} \
                        .
                '''
            }
        }

        // =====================================================
        // 6. LOGIN TO DOCKER HUB
        // =====================================================
        stage('Docker Login') {
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
                    '''
                }
            }
        }

        // =====================================================
        // 7. PUSH DOCKER IMAGE
        // =====================================================
        stage('Docker Push') {
            steps {
                echo 'Pushing Docker image to Docker Hub...'

                sh '''
                    docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                '''
            }
        }

        // =====================================================
        // 8. VERIFY PIPELINE RESULT
        // =====================================================
        stage('Verify') {
            steps {
                echo '========================================='
                echo 'Application build completed.'
                echo "Docker image: ${DOCKER_IMAGE}:${IMAGE_TAG}"
                echo '========================================='
            }
        }
    }

    // =========================================================
    // POST ACTIONS
    // =========================================================
    post {

        success {
            echo '========================================='
            echo '          CI PIPELINE SUCCESS'
            echo '========================================='
            echo "Build Number : ${BUILD_NUMBER}"
            echo "Docker Image : ${DOCKER_IMAGE}:${IMAGE_TAG}"
            echo 'Docker image pushed successfully.'
            echo '========================================='
        }

        failure {
            echo '========================================='
            echo '           CI PIPELINE FAILED'
            echo '========================================='
            echo "Build Number : ${BUILD_NUMBER}"
            echo 'Check Jenkins Console Output.'
            echo '========================================='
        }

        always {
            echo 'Cleaning Jenkins workspace...'

            deleteDir()
        }
    }
}

// update 