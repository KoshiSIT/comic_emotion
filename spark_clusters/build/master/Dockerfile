FROM spark:3.5.0-scala2.12-java17-ubuntu

# 必要なパッケージをインストール
USER root
RUN apt-get update && apt-get install -y python3 python3-pip

WORKDIR /opt/spark

CMD ["/bin/bash"]