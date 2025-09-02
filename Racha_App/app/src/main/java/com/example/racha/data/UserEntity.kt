package com.example.racha.data

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "users",
    indices = [Index(value = ["cpf"], unique = true)]
)
data class UserEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val nome: String,
    val cpf: String,
    val telefone: String,
    val email: String,
    val senha: String,
    val saldo: Double = 0.0
)