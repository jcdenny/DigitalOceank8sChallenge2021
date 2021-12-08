resource "digitalocean_kubernetes_cluster" "k8s" {
  name   = "challenge"
  region = "nyc1"
  version = "1.21.5-do.0"

  node_pool {
    name       = "default"
    size       = "s-2vcpu-2gb"
    node_count = 3
  }
}