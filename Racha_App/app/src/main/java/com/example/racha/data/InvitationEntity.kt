package com.example.racha.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "invitations")
data class InvitationEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val cardId: Int,
    val inviterCpf: String,
    val inviteeIdentifier: String,  // CPF ou email
    val status: String = "pending"  // pending, accepted, rejected
)