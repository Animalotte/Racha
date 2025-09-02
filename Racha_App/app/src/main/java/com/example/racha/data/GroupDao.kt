package com.example.racha.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query

@Dao
interface GroupDao {
    @Insert
    suspend fun insert(group: GroupEntity)

    @Query("SELECT * FROM `groups` WHERE creatorCpf = :cpf")
    suspend fun getGroupsForUser(cpf: String): List<GroupEntity>
}