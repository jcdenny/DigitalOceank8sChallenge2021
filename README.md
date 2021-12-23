## DigitalOceank8sChallenge2021

Deploy a scalable message queue
A critical component of all the scalable architectures are message queues used to store and distribute messages to multiple parties and introduce buffering. Kafka is widely used in this space and there are multiple operators like [Strimzi](https://strimzi.io/) or to deploy it. For this project, use a sample app to demonstrate how your message queue works.


## Overview
The app simply takes a POST to the producer url ```http://producer.denops.net``` which produces a message to a kafka topic to a specific group ID. The message is received by the receiver using a GET to the consumer url ```http://consumer.denops.net```. The consumer appends the kafka message to a local file which is read after the request is completed. Both Kafka and the producer/consumer app are deployed to the
managed kubernetes cluster running in Digital Ocean. Included in the repo is the IaC to spin up the kubernetes cluster.

### Current Running Example
###3 Create a message through the producer
```
curl -X POST http://producer.denops.net
   -H "Content-Type: application/json"
   -d '{"message": "test"}'
```
#### View the message through the consumer
```
http://consumer.denops.net/
```

### Built With

* [terraform](https://www.terraform.io/)
* [Strimzi](https://strimzi.io/)
* [nodejs](https://nodejs.org/en/)
* [kafkajs](https://kafka.js.org/)

<p align="right">(<a href="#top">back to top</a>)</p>

Creating the infrastructure 

### Prerequisites

Tools required:
* [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* [kubectl](https://kubernetes.io/docs/tasks/tools/)
* [helm](https://helm.sh/docs/intro/install/)
* [doctl](https://docs.digitalocean.com/reference/doctl/how-to/install/)
* [docker desktop](https://www.docker.com/products/docker-desktop)

[Configure auth to Digital Ocean using doctl](https://docs.digitalocean.com/reference/doctl/how-to/install/)

### Deploy the infrastructure

1. From the terraform directory
   ```
   terraform apply
   ```
2. Type ```yes``` and hit ```enter``` at the prompt
 
Creation of the kubernetes cluster will take some time. Approx 8 minutes.
<p align="right">(<a href="#top">back to top</a>)</p>

### Deploy the ingress-controller and create a load balancer
1. From the k8s directory
   ```
   kubectl apply -f ./namespaces/ingress.yaml
   ```
2. Install the ingress via helm
   ```
   helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
   helm install nginx-ingress ingress-nginx/ingress-nginx --set controller.publishService.enabled=true -n ingress
   ```

### Deploy Strimzi (kafka cluster)
1. Deploy the kafka namespace
```
kubectl apply -f ./k8s/namespaces/kafka.yaml
```
2. Deploy the Strimzi CRD, roles, clusterroles, etc...
```
kubectl apply -f ./k8s/strimzi/strimzi-setup.yaml -n kafka
```
3. Deploy the kafaka cluster
```
kubectl apply -f ./k8s/strimzi/strimzi-cluster.yaml
```
### Test the kafka cluster
1. Start a producer
```
kubectl -n kafka run kafka-producer -ti --image=quay.io/strimzi/kafka:0.26.0-kafka-3.0.0 --rm=true --restart=Never -- bin/kafka-console-producer.sh --broker-list cluster-kafka-bootstrap:9092 --topic my-topic
```
2. From a new console start a consumer
```
kubectl -n kafka run kafka-consumer -ti --image=quay.io/strimzi/kafka:0.26.0-kafka-3.0.0 --rm=true --restart=Never -- bin/kafka-console-consumer.sh --bootstrap-server cluster-kafka-bootstrap:9092 --topic my-topic --from-beginning
```
3. From the producer command line type a message and hit enter
```
> This is a test message
```
The consumer should receive and display the message

### CICD with Tekton (optional)
1. Install tekton
```
kubectl apply -f ./k8s/tekton/tekton.yaml
```
2. Install the tekton dashboard
```
kubectl apply -f ./k8s/tekton/tekton-dashboard-release.yaml
```

### Deploy the producer app
1. Create the docker image and push to your repo of your choice.
```
kubectl apply -f ./apps/producer/producer.yaml
```
### Deploy the consumer app
1. Create the docker image and push to your repo of your choice.
```
kubectl apply -f ./apps/consumer/consumer.yaml
```

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>