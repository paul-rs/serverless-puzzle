# Very Crude int test helper during coding
echo 'Deploying int test stack'
sls deploy --stage=int

echo 'Invoking lambda:'
start_time=$(($(date -u +"%s") * 1000 ))
sls invoke --stage=int --function getComment --path=../integration/test_data.json

echo 'Showing 3 latest s3 files:'
aws s3 ls int-rps-inbox --recursive | sort | tail -n 3

echo 'Waiting for cloudwatch logs'
sleep 15

echo 'Showing cloudwatch logs'
group_name='/aws/lambda/comments-service-int-commentParser'
logs=$( aws --region ap-southeast-1 --output text logs filter-log-events --log-group-name "$group_name" --interleaved --start-time $start_time )
echo "$logs"
