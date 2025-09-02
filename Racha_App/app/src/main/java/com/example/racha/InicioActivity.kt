package com.example.racha

import android.content.Intent
import android.os.Bundle
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.racha.data.AppDatabase
import kotlinx.coroutines.launch

class InicioActivity : AppCompatActivity() {
    private lateinit var textBemVindo: TextView
    private lateinit var textSaldo: TextView
    private lateinit var db: AppDatabase

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_inicio)

        textBemVindo = findViewById(R.id.textBemVindo)
        textSaldo = findViewById(R.id.textSaldo)
        db = AppDatabase.instance(this)

        val cpf = intent.getStringExtra("cpf")

        if (cpf != null) {
            lifecycleScope.launch {
                val user = db.userDao().getUserByCpf(cpf)
                user?.let {
                    runOnUiThread {
                        textBemVindo.text = "Olá, ${it.nome}!"
                        textSaldo.text = "Saldo: R$ %.2f".format(it.saldo)
                    }
                }
            }
        }

        // Atalho Cartões
        findViewById<LinearLayout>(R.id.atalhoCartoes).setOnClickListener {
            val intent = Intent(this, CartoesActivity::class.java)
            intent.putExtra("cpf", cpf)
            startActivity(intent)
        }

        // Novo: Atalho Grupos (adicione no layout se necessário)
        findViewById<LinearLayout>(R.id.atalhoGrupos)?.setOnClickListener {
            val intent = Intent(this, GruposActivity::class.java)
            intent.putExtra("cpf", cpf)
            startActivity(intent)
        }

        // Novo: Atalho Notificações (adicione no layout se necessário)
        findViewById<LinearLayout>(R.id.atalhoNotificacoes)?.setOnClickListener {
            val intent = Intent(this, NotificacoesActivity::class.java)
            intent.putExtra("cpf", cpf)
            startActivity(intent)
        }
    }
}