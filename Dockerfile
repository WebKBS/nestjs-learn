# 공식 Node.js 이미지를 기본 이미지로 사용
FROM node:20

# 컨테이너 내부에 작업 디렉터리를 설정합니다.
WORKDIR /usr/src/app

# package.json 및 package-lock.json을 작업 디렉터리에 복사합니다.
COPY package*.json ./

# 애플리케이션 종속성 설치
RUN npm install

# 나머지 응용 프로그램 파일을 복사합니다.
COPY . .

# NestJS 애플리케이션 빌드
RUN npm run build

# 애플리케이션 포트 노출
EXPOSE 3000

# 애플리케이션을 실행하는 명령
CMD ["node", "dist/main"]