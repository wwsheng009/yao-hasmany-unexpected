
function Save(payload) {
  //先保存主表，获取id后再保存从表
  
  let res = null
  try {
    res = Process('models.pet.Save', payload);
    if (res.code && res.code > 300) {
      throw new Exception(res.message, res.code);
    }
    SaveRelations(res, payload);
  } catch (error) {
    console.log("Data Save Failed")
    
    if(error.message,error.code){
      console.log("error:",error.code,error.message)
      throw new Exception(error.message,error.code)
    }else{
      console.log(error)
      throw error
    }
  }

return res
}
//保存关联表数据
function SaveRelations(id, payload) {
  Save_cats(id,payload);
	Save_dogs(id,payload);
  return id;
}

//删除关联表数据
function BeforeDelete(id){
  Delete_cats(id);
	Delete_dogs(id);
}


//保存cat
function Save_cats(id,payload){
  const items = payload.cats || {};
  const deletes = items.delete || [];
  const data = items.data || items || [];
  if (data.length > 0 || deletes.length > 0) {
    // 忽略实际数据 ( 通过 record 计算获取)
    for (const i in data) {
      if (typeof data[i].id === 'string' && data[i].id.startsWith('_')) {
        //新增项目，在前端会生成唯一字符串,
        //由于后台使用的自增长ID，不需要生成的唯一字符串，由数据库生成索引
        delete data[i].id;
      }
    }

    // 保存物品清单
    var res = Process('models.cat.EachSaveAfterDelete', deletes, data, {
      pet_id: id,
    });
    if (res.code && res.code > 300) {
      console.log('cat:AfterSave Error:', res);
      console.log(items)
      throw new Exception(res.message,res.code)
    }else{
      return id;
    }
  }
}


//保存dog
function Save_dogs(id,payload){
  const items = payload.dogs || {};
  const deletes = items.delete || [];
  const data = items.data || items || [];
  if (data.length > 0 || deletes.length > 0) {
    // 忽略实际数据 ( 通过 record 计算获取)
    for (const i in data) {
      if (typeof data[i].id === 'string' && data[i].id.startsWith('_')) {
        //新增项目，在前端会生成唯一字符串,
        //由于后台使用的自增长ID，不需要生成的唯一字符串，由数据库生成索引
        delete data[i].id;
      }
    }

    // 保存物品清单
    var res = Process('models.dog.EachSaveAfterDelete', deletes, data, {
      pet_id: id,
    });
    if (res.code && res.code > 300) {
      console.log('dog:AfterSave Error:', res);
      console.log(items)
      throw new Exception(res.message,res.code)
    }else{
      return id;
    }
  }
}



//删除cat == pet_id
function Delete_cats(id){
  let rows = Process('models.cat.DeleteWhere', {
    wheres: [{ column: 'pet_id', value: id }],
  });

  //remembe to return the id in array format
  return [id];
}


//删除dog == pet_id
function Delete_dogs(id){
  let rows = Process('models.dog.DeleteWhere', {
    wheres: [{ column: 'pet_id', value: id }],
  });

  //remembe to return the id in array format
  return [id];
}


