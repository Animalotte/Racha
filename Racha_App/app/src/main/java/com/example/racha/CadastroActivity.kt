package com.example.racha

import android.content.Intent
import android.database.sqlite.SQLiteConstraintException
import android.os.Build
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.racha.data.AppDatabase
import com.example.racha.data.UserEntity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.text.ParseException
import java.text.SimpleDateFormat
import java.time.LocalDate
import java.time.Period
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException
import java.util.*

class CadastroActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_cadastro)

        val btnVoltar    = findViewById<ImageView>(R.id.btnVoltar)
        val btnCadastrar = findViewById<Button>(R.id.btnCadastrar)
        val txtLogin     = findViewById<TextView>(R.id.txtLogin)

        val edtNome   = findViewById<EditText>(R.id.edtNome)
        val edtNasc   = findViewById<EditText>(R.id.edtData)
        val edtCpf    = findViewById<EditText>(R.id.edtCpf)
        val edtTel    = findViewById<EditText>(R.id.edtTelefone)
        val edtEmail  = findViewById<EditText>(R.id.edtEmail)
        val edtSenha  = findViewById<EditText>(R.id.edtSenha)
        val edtConf   = findViewById<EditText>(R.id.edtConfirmaSenha)

        // Máscaras
        edtCpf.addTextChangedListener(MaskWatcher("###.###.###-##"))
        edtTel.addTextChangedListener(MaskWatcher("(##) #####-####"))
        edtNasc.addTextChangedListener(MaskWatcher("##/##/####"))

        btnVoltar.setOnClickListener { finish() }
        txtLogin.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }

        btnCadastrar.setOnClickListener {
            val nome   = edtNome.text.toString().trim()
            val nasc   = edtNasc.text.toString().trim()
            val cpf    = edtCpf.text.toString()
            val tel    = edtTel.text.toString()
            val email  = edtEmail.text.toString()
            val senha  = edtSenha.text.toString()
            val conf   = edtConf.text.toString()

            if (nome.isEmpty()) { edtNome.error = "Nome obrigatório"; return@setOnClickListener }
            val idade = idadeDoUsuario(nasc)
            if (idade == null) { edtNasc.error = "Data inválida"; return@setOnClickListener }
            if (idade < 16)    { edtNasc.error = "Necessário ter 16+ anos"; return@setOnClickListener }
            if (!isValidCpf(cpf))        { edtCpf.error = "CPF inválido"; return@setOnClickListener }
            if (!isValidEmail(email))    { edtEmail.error = "E-mail inválido"; return@setOnClickListener }
            if (!isValidPassword(senha)) { edtSenha.error = "Senha fraca: 8+, 1 maiús, 1 nº, 1 símbolo"; return@setOnClickListener }
            if (senha != conf)           { edtConf.error = "Senhas não coincidem"; return@setOnClickListener }

            val cleanCpf = cpf.filter(Char::isDigit)

            lifecycleScope.launch(Dispatchers.IO) {
                try {
                    val user = UserEntity(
                        nome = nome,
                        cpf = cleanCpf,
                        telefone = tel,
                        email = email,
                        senha = senha,
                        saldo = 0.0
                    )
                    AppDatabase.instance(this@CadastroActivity).userDao().insert(user)

                    runOnUiThread {
                        Toast.makeText(this@CadastroActivity, "Cadastro realizado!", Toast.LENGTH_SHORT).show()
                        startActivity(Intent(this@CadastroActivity, LoginActivity::class.java).apply {
                            putExtra("CPF", cleanCpf)
                            putExtra("SENHA", senha)
                        })
                        finish()
                    }
                } catch (e: SQLiteConstraintException) {
                    runOnUiThread { edtCpf.error = "CPF já cadastrado" }
                } catch (e: Exception) {
                    runOnUiThread { Toast.makeText(this@CadastroActivity, "Erro ao salvar", Toast.LENGTH_SHORT).show() }
                }
            }
        }
    }

    private fun idadeDoUsuario(dataStr: String): Int? {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try {
                val formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy")
                val nasc = LocalDate.parse(dataStr, formatter)
                Period.between(nasc, LocalDate.now()).years
            } catch (_: DateTimeParseException) { null }
        } else {
            val sdf = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())
            sdf.isLenient = false
            try {
                val nasc = Calendar.getInstance().apply { time = sdf.parse(dataStr)!! }
                val hoje = Calendar.getInstance()
                var idade = hoje.get(Calendar.YEAR) - nasc.get(Calendar.YEAR)
                if (hoje.get(Calendar.DAY_OF_YEAR) < nasc.get(Calendar.DAY_OF_YEAR)) idade--
                idade
            } catch (_: ParseException) { null }
        }
    }

    private fun isValidEmail(e: String) = android.util.Patterns.EMAIL_ADDRESS.matcher(e).matches()

    private fun isValidPassword(p: String): Boolean {
        val regex = Regex("^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#\$%^&*()_+\\-={}\\[\\]:\";'<>?,./]).{8,}")
        return regex.matches(p) && !p.contains(" ")
    }

    private fun isValidCpf(cpf: String): Boolean {
        val digits = cpf.filter { it.isDigit() }
        if (digits.length != 11 || digits.all { it == digits[0] }) return false
        val n = digits.map { it.digitToInt() }
        val dv1 = (0..8).sumOf { (10 - it) * n[it] }.let { ((it * 10) % 11).let { d -> if (d == 10) 0 else d } }
        val dv2 = (0..9).sumOf { (11 - it) * n[it] }.let { ((it * 10) % 11).let { d -> if (d == 10) 0 else d } }
        return dv1 == n[9] && dv2 == n[10]
    }
}