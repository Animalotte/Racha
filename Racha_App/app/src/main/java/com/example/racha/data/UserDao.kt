package com.example.racha.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query

@Dao
interface UserDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(user: UserEntity)

    @Query("SELECT * FROM users WHERE cpf = :cpf AND senha = :senha LIMIT 1")
    suspend fun login(cpf: String, senha: String): UserEntity?

    @Query("SELECT * FROM users WHERE cpf = :cpf LIMIT 1")
    suspend fun getUserByCpf(cpf: String): UserEntity?

    @Query("SELECT * FROM users WHERE email = :email LIMIT 1")
    suspend fun getUserByEmail(email: String): UserEntity?
}