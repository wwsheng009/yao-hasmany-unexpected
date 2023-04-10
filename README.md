# 如果在一个表里有多个 hasmany 的关联关系，无法获取正常的值。

```sh

git clone https://github.com/wwsheng009/yao-hasmany-unexpected.git
cd yao-hasmany-unexpected
yao migrate --reset
```

如果在一个表里有多个 hasmany 的关联关系，无法获取正常的值。

比如下命令读取宠物表中关联的猫与狗信息。返回值无法正确归集。

```sh
yao run yao.table.get pet '::{"withs":{"dog":{}},"withs":{"cat":{"withs":{"whitecat":{}}}}}'
```

期待的结果：

```sh
pets:
    - dogs
    - cats
        - whitecat
```

错误的结果如下：

```sh
--------------------------------------
yao.table.get 返回结果
--------------------------------------
[
    {
        "dogs": [
            {
                "id": 1,
                "name": "dog  one",
                "pet_id": 1
            },
            {
                "dogs": [
                    {
                        "id": 1,
                        "name": "cat  one",
                        "pet_id": 2
                    },
                    {
                        "id": 2,
                        "name": "cat  two",
                        "pet_id": 2
                    }
                ],
                "id": 2,
                "name": "dog  two",
                "pet_id": 1
            }
        ],
        "id": 1,
        "name": "dog number one"
    },
    {
        "id": 2,
        "name": "cat number two"
    }
]
```
