package com.example.racha.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query

@Dao
interface InvitationDao {
    @Insert
    suspend fun insert(invitation: InvitationEntity)

    @Query("SELECT * FROM invitations WHERE inviteeIdentifier = :identifier AND status = 'pending'")
    suspend fun getPendingInvitesForUser(identifier: String): List<InvitationEntity>

    @Query("UPDATE invitations SET status = :status WHERE id = :id")
    suspend fun updateStatus(id: Int, status: String)
}