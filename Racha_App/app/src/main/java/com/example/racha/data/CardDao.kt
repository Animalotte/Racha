package com.example.racha.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query

@Dao
interface CardDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(card: CardEntity)

    @Query("SELECT * FROM cards WHERE userCpf = :cpf")
    suspend fun getCardsForUser(cpf: String): List<CardEntity>

    @Query("UPDATE cards SET groupId = :groupId WHERE id = :cardId")
    suspend fun allocateToGroup(cardId: Int, groupId: Int)
}