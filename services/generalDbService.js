'use strict';

const select = async (table, filter) => {

    const data = await knex(table)
    .select(filter)
    .catch((ex)=>{
        console.log(ex);
        return [];
    });

    return data;
}

const selectPage = async (table, filter , currentPage, perPage ) => {

    const data = await knex(table)
        .select(filter)
        .paginate({
            perPage,
            currentPage,
            isLengthAware:true,
        })
        .catch((ex)=>{
            console.log(ex);
            return [];
        });

    return data;
}

const selectPageWhere = async ( whereFields, table, filter , currentPage, perPage ) => {

    const data = await knex(table)
        .select(filter)
        .where((q) => {
            whereFields.map((row)=> {
              const {field, value} = row;
              q.where(field, value);
            })
          })
        .paginate({
            perPage,
            currentPage,
            isLengthAware:true,
        })
        .catch((ex)=>{
            console.log(ex);
            return [];
        });

    return data;
}

const selectWhere = async (whereFields, table, filter) => {

    const data = await knex(table)
    .select(filter)
    .where((q) => {
      whereFields.map((row)=> {
        const {field, value} = row;
        q.where(field, value);
      })
    })
    .catch((ex)=>{
        console.log(ex);
        return [];
    });

    return data;
}

const insertRecord = async ( data, table) => {

    await knex(table)
        .insert( data )
        .catch((ex)=>{
            console.log(ex)
            return false;
        });

    return true;
}

const upsertRecord = async ( data, table, conflictId) => {

    await knex(table)
        .insert(data)
        .onConflict(conflictId)
        .merge()
        .catch((ex)=>{
            console.log(ex)
            return false;
        });

    return true;
}

const updateRecord = async ( data, table, idName, id) => {

    await knex(table)
        .update(data )
        .where(idName,id)
        .catch((ex)=>{
            console.log(ex)
            return false;
        });

    return true;
}

const delRecord = async (table, idName, id) => {

    await knex(table)
        .delete()
        .where(idName,id)
        .catch((ex)=>{
            console.log(ex)
            return false;
        });

    return true;
}

module.exports = {
    select, selectWhere , insertRecord , updateRecord, selectPage, delRecord, selectPageWhere, upsertRecord
};