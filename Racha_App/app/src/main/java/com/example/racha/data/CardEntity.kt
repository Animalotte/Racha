package com.example.racha.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "cards")
data class CardEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val userCpf: String,
    val name: String,
    val type: String,  // "unico" or "recorrente"
    val value: Double,
    val groupId: Int? = null  // Opcional para alocação em grupo
)