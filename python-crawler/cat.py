import re
import os
from os.path import join

import requests
import urllib.request  # 主要用于打开和阅读url
import urllib.error  # 用于错误处理

dirpath = "/Users/yuwen/Documents/template-code/python-crawler/"
dirname = "image"


def fetch(url, dirname):
    count = 1
    m = urllib.request.urlopen(url).read()
    new_path = os.path.join(dirpath, dirname)
    if not os.path.isdir(new_path):
        os.makedirs(new_path)  # 创建目录保存每个网页上的图片
    page_data = m.decode()
    page_image = re.compile('"objURL":"(.*?)"')  # 匹配图片的pattern
    for image in page_image.findall(page_data):  # 用正则表达式匹配所有的图片
        pattern = re.compile(r"http://.*.jpg$")  # 匹配jpg格式的文件
        if pattern.match(image):  # 如果匹配，则获取图片信息，若不匹配，进行下一个页面的匹配
            try:
                image_data = urllib.request.urlopen(image).read()  # 获取图片信息
                image_path = os.path.join(
                    dirpath, dirname, dirname + str(count) + ".jpg"
                )  # 给图片命名
                with open(image_path, "wb") as image_file:
                    image_file.write(image_data)  # 将图片写入文件
                print("已下载 {} 张 {} 图片: {}".format(count, dirname, image))
                count += 1
            except:
                print("图片下载失败: {}".format(image))


if __name__ == "__main__":
    url1 = "https://image.baidu.com/search/index?&tn=baiduimage&word=%E6%A9%98%E7%8C%AB"
    url2 = "https://image.baidu.com/search/index?&tn=baiduimage&word=%E7%8B%97"
    url3 = "https://image.baidu.com/search/index?&tn=baiduimage&word=%E5%A4%A7%E7%86%8A%E7%8C%AB"

    fetch(url1, "cats")
    fetch(url2, "dogs")
    fetch(url3, "pandas")
