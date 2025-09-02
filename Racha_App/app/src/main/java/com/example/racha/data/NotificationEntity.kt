package com.example.racha.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "notifications")
data class NotificationEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val userCpf: String,
    val message: String,
    val timestamp: Long = System.currentTimeMillis(),
    val relatedId: Int? = null  // Ex: ID do convite ou cartão
)