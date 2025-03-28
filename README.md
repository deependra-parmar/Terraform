<<<<<<< HEAD
# Terraform
=======
# Terraform
IaC platform or tool helps in provisioning, managing and automating the cloud infrastructure as code.

---

In this one, we are going to deploy a static html, css, js website on Bucket in GCP, attach it with ELB, followed by a Cloud CDN and then adding a DNS entry using Cloud DNS.

Let's get started

```
main.tf : consists of main resources like s3 bucket, elb, etc

provider.tf: configures the gcp provider for the project

variables.tf: Used to declare the variables.

terraform.tfvars: Assign values to variables. Generally used for assigning values in different envs.
```

---

After understanding all this, I have executed the following command in the /infra directory

```
terraform init
```

which brings the .terraform for storing the states of the application and its deployment. The command also brings and configures the GCP provider for the project.

---

### States in Terraform
Used to memoize or remember what are the resources that were deployed last time you run terraform apply in order to keep track of changes and what not to deploy again.
In a nutshell, the statefile is the copy of your current deployment in the cloud.

Now, we can execute the following command to see what are the different operations terraform is going to create or do in the infrastructure with the current configuration and shows the list of all of them.

```
terraform plan
```

and after reviewing the plan logs if everything seems fine to you, you can apply to provision the resources and go ahead.

```
terraform apply
```
>>>>>>> 840c90f (Initial Commit)
