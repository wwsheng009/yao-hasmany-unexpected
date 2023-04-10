
function Save(payload) {
  //先保存主表，获取id后再保存从表
  
  let res = null
  try {
    res = Process('models.cat.Save', payload);
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
  Save_white_cats(id,payload);
  return id;
}

//删除关联表数据
function BeforeDelete(id){
  Delete_white_cats(id);
}


//保存whitecat
function Save_white_cats(id,payload){
  const items = payload.white_cats || {};
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
    var res = Process('models.whitecat.EachSaveAfterDelete', deletes, data, {
      cat_id: id,
    });
    if (res.code && res.code > 300) {
      console.log('whitecat:AfterSave Error:', res);
      console.log(items)
      throw new Exception(res.message,res.code)
    }else{
      return id;
    }
  }
}



//删除whitecat == cat_id
function Delete_white_cats(id){
  let rows = Process('models.whitecat.DeleteWhere', {
    wheres: [{ column: 'cat_id', value: id }],
  });

  //remembe to return the id in array format
  return [id];
}


