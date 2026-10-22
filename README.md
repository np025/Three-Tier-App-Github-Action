## This is a test application. The main focus is to learn and practice GitHub Actions.

## Deploying to AKS

The `CD - Deploy to AKS` GitHub Actions workflow builds and pushes the selected
image to ACR, then deploys it to the `demo` namespace. Before running it, add
these GitHub Actions secrets:

- `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`
- `RESOURCE_GROUP`, `AKS_CLUSTER_NAME`, `ACR_NAME`
- `DB_PASSWORD`, `JWT_SECRET_KEY`, `EX_API` (required when deploying the backend)

The Azure identity must be configured for GitHub Actions workload identity
federation, and AKS must be allowed to pull images from ACR. The backend
Deployment expects the PostgreSQL Flexible Server and database configured in
`k8s/backend-deployment.yaml`; the AKS cluster must be able to connect to that
server.

Use the workflow to deploy the application images; the Deployment manifests
contain placeholder images that the workflow replaces with the newly built ACR
images.

The frontend Service uses an Azure LoadBalancer. Once the workflow completes,
get its public address with:

```sh
kubectl get service frontend --namespace demo
```

The frontend proxies `/api` requests to the internal backend Service, so the
backend does not need a public IP. The backend secret is created or updated by
the workflow from the three backend GitHub Actions secrets above.
