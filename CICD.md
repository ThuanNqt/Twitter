# Cẩm nang CI/CD cơ bản

Flow cơ bản làm việc với CI/CD

Code ở dưới local push lên Github -> Github action sẽ tiến hành build image và đẩy iamge lên docker hub -> Server sẽ kéo theo image từ docker hub về và chạy

## Đăng ký tài khoản trên Docker hub

### Đăng nhập vào docker trong terminal

docker login -u <username> -p <password>

### Đẩy image lên docker hub

Đối với image cùng tên:
docker push new-repo:tagname

Đối với image khác tên: (Tạo 1 repo trên docker hub trước)
docker tag local-image:tagname new-repo:tagname
docker push new-repo:tagname

### Pull docker image về local

docker pull repo:tagname

> Image mà được build ở mỗi máy tính sẽ có sự khác nhau. Có thể sẽ không chạy được trên máy tính khác.
> Ví dụ: Image được build ở máy tính Macbook M2 dùng chip **ARM**, sẽ không chạy được trên chip **Intel hoặc AMD**
