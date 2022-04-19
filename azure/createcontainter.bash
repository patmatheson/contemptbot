RESOURCE_GROUP="contempt"
LOCATION="eastus"
LOG_ANALYTICS_WORKSPACE="contempt"
CONTAINERAPPS_ENVIRONMENT="contempt"

LOG_ANALYTICS_WORKSPACE_CLIENT_ID=`az monitor log-analytics workspace show --query customerId -g $RESOURCE_GROUP -n $LOG_ANALYTICS_WORKSPACE -o tsv | tr -d '[:space:]'`
LOG_ANALYTICS_WORKSPACE_CLIENT_SECRET=`az monitor log-analytics workspace get-shared-keys --query primarySharedKey -g $RESOURCE_GROUP -n $LOG_ANALYTICS_WORKSPACE -o tsv | tr -d '[:space:]'`

CONTAINER_IMAGE_NAME=schonhoffer.azurecr.io/contempt:66cd509e3a84cde301be8622c7208fcc6a711138
REGISTRY_LOGIN_SERVER="schonhoffer.azurecr.io"
REGISTRY_USERNAME=schonhoffer
REGISTRY_PASSWORD=`az acr credential show -n schonhoffer --query passwords[0].value | tr -d '"'`


az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION

az monitor log-analytics workspace create --resource-group $RESOURCE_GROUP --workspace-name $LOG_ANALYTICS_WORKSPACE
az extension add --source https://workerappscliextension.blob.core.windows.net/azure-cli-extension/containerapp-0.2.4-py2.py3-none-any.whl

az containerapp env create \
  --name $CONTAINERAPPS_ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --logs-workspace-id $LOG_ANALYTICS_WORKSPACE_CLIENT_ID \
  --logs-workspace-key $LOG_ANALYTICS_WORKSPACE_CLIENT_SECRET \
  --location "$LOCATION"


az deployment group create --resource-group "$RESOURCE_GROUP" \
  --template-file ./template.json \
  --parameters \
    environment_name="$CONTAINERAPPS_ENVIRONMENT" \
	discord-bot-key="$DISCORD_BOT_KEY" \
	discord-bot-id="$DISCORD_BOT_ID" \
	acrpassword="$REGISTRY_PASSWORD" \
	mongo-conn-string="$MONGO_CONN_STRING" \
    location="$LOCATION"


az containerapp create \
  --name contempt \
  --resource-group $RESOURCE_GROUP \
  --image $CONTAINER_IMAGE_NAME \
  --environment $CONTAINERAPPS_ENVIRONMENT \
  --registry-server $REGISTRY_LOGIN_SERVER \
  --registry-username $REGISTRY_USERNAME \
  --registry-password $REGISTRY_PASSWORD
