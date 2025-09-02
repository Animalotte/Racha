package com.example.racha

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.racha.data.AppDatabase
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {
    private lateinit var cpfEditText: EditText
    private lateinit var senhaEditText: EditText
    private lateinit var loginButton: Button
    private lateinit var txtCadastro: TextView
    private lateinit var db: AppDatabase

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        cpfEditText = findViewById(R.id.editTextCpf)
        senhaEditText = findViewById(R.id.editTextSenha)
        loginButton = findViewById(R.id.btnEntrar)
        txtCadastro = findViewById(R.id.txtCadastro)
        db = AppDatabase.instance(this)

        // Aplicar máscara no CPF
        cpfEditText.addTextChangedListener(MaskWatcher("###.###.###-##"))

        // Preencher campos se vier de cadastro
        val cpfExtra = intent.getStringExtra("CPF")
        val senhaExtra = intent.getStringExtra("SENHA")
        if (cpfExtra != null) cpfEditText.setText(cpfExtra)
        if (senhaExtra != null) senhaEditText.setText(senhaExtra)

        loginButton.setOnClickListener {
            val cpfMasked = cpfEditText.text.toString()
            val cpf = cpfMasked.filter { it.isDigit() }
            val senha = senhaEditText.text.toString()

            lifecycleScope.launch {
                val user = db.userDao().login(cpf, senha)
                if (user != null) {
                    val intent = Intent(this@LoginActivity, InicioActivity::class.java)
                    intent.putExtra("cpf", user.cpf)
                    startActivity(intent)
                    finish()
                } else {
                    runOnUiThread {
                        Toast.makeText(this@LoginActivity, "CPF ou senha incorretos!", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }

        txtCadastro.setOnClickListener {
            startActivity(Intent(this, CadastroActivity::class.java))
            finish()
        }
    }
}