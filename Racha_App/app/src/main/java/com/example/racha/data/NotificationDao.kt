package com.example.racha.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query

@Dao
interface NotificationDao {
    @Insert
    suspend fun insert(notification: NotificationEntity)

    @Query("SELECT * FROM notifications WHERE userCpf = :cpf ORDER BY timestamp DESC")
    suspend fun getNotificationsForUser(cpf: String): List<NotificationEntity>
}