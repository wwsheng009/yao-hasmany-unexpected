// import { Process } from "yao-node-client";
/**
 * 转换图片显示格式
 *
 * scripts.file.image.ImagesView
 * @param data 图片字段设置
 * @returns string[] 数组格式的图片地址
 */
function ImagesView(data) {
    if (!data || !data.length) {
        return [];
    }
    return data.includes("[") ? JSON.parse(data) : data.split(",");
}
/**
 * scripts.file.image.ImagesEdit
 * @param row 行数据
 * @param name 字段名称
 * @param model_name 模型名称
 * @returns 处理后的图片地址
 */
function ImagesEdit(row, name, model_name) {
    const table = Process("schemas.default.TableGet", model_name);
    const column = table.columns.find((col) => col.name === name);
    if (!column || column.type === "json") {
        return row[name];
    }
    return JSON.stringify(row[name]);
}
