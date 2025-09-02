package com.example.racha.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase

@Database(entities = [UserEntity::class, CardEntity::class, GroupEntity::class, InvitationEntity::class, NotificationEntity::class], version = 4, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
    abstract fun cardDao(): CardDao
    abstract fun groupDao(): GroupDao
    abstract fun invitationDao(): InvitationDao
    abstract fun notificationDao(): NotificationDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        // Migração de 3 para 4: Adiciona a coluna groupId à tabela cards
        val MIGRATION_3_4 = object : Migration(3, 4) {
            override fun migrate(db: SupportSQLiteDatabase) {
                // Adiciona a coluna groupId (INTEGER, nullable)
                db.execSQL("ALTER TABLE cards ADD COLUMN groupId INTEGER")
                // Se precisar criar novas tabelas manualmente (ex.: groups, invitations, notifications), adicione aqui:
                // db.execSQL("CREATE TABLE IF NOT EXISTS `groups` (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL, creatorCpf TEXT NOT NULL)")
                // Mas o Room cuida disso automaticamente com as entidades.
            }
        }

        fun instance(context: Context): AppDatabase =
            INSTANCE ?: synchronized(this) {
                Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "racha.db"
                )
                    .addMigrations(MIGRATION_3_4)  // Adiciona a migração
                    // .fallbackToDestructiveMigration()  // Remova ou comente para evitar perda de dados
                    .build().also { INSTANCE = it }
            }
    }
}