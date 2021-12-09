FROM openjdk:latest
COPY ./lib /usr/src/sabparser/lib
COPY ./input  /usr/src/sabparser/input
ADD ./beanparsertool.jar /usr/src/sabparser

WORKDIR /usr/src/sabparser

ENTRYPOINT java -jar beanparsertool.jar -D exec.mainClass="curam.tool.beanparser.run.DomainsLookupTool"