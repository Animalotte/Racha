package com.example.racha

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.racha.data.AppDatabase
import com.example.racha.data.NotificationEntity
import kotlinx.coroutines.launch

class NotificacoesActivity : AppCompatActivity() {
    private lateinit var recyclerNotificacoes: RecyclerView
    private lateinit var db: AppDatabase
    private var cpf: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_notificacoes)  // Crie um layout com RecyclerView

        recyclerNotificacoes = findViewById(R.id.recyclerNotificacoes)
        db = AppDatabase.instance(this)

        cpf = intent.getStringExtra("cpf")

        recyclerNotificacoes.layoutManager = LinearLayoutManager(this)

        if (cpf != null) {
            carregarNotificacoes()
        }
    }

    private fun carregarNotificacoes() {
        lifecycleScope.launch {
            val notifications = db.notificationDao().getNotificationsForUser(cpf!!)
            recyclerNotificacoes.adapter = NotificationAdapter(notifications)
        }
    }
}