package com.example.racha

import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.InputType
import android.text.TextWatcher
import android.view.MotionEvent
import android.widget.*
import androidx.appcompat.app.AppCompatActivity

class LoginActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val edtCpf      = findViewById<EditText>(R.id.editTextCpf)
        val edtSenha    = findViewById<EditText>(R.id.editTextSenha)
        val btnEntrar   = findViewById<Button>(R.id.btnEntrar)
        val txtCadastro = findViewById<TextView>(R.id.txtCadastro)

        // Aplica máscara no CPF (ARRUMAR!)
        edtCpf.addTextChangedListener(MaskWatcher("###.###.###-##"))


        intent.getStringExtra("CPF")?.let { edtCpf.setText(it) }
        intent.getStringExtra("SENHA")?.let { edtSenha.setText(it) }


        var senhaVisivel = false
        val originalTypeface = edtSenha.typeface
        edtSenha.setOnTouchListener { _, event ->
            if (event.action == MotionEvent.ACTION_UP) {
                val drawableEnd = 2
                edtSenha.compoundDrawables[drawableEnd]?.let { icon ->
                    val clicouNoOlho = event.rawX >= (edtSenha.right - icon.bounds.width())
                    if (clicouNoOlho) {
                        senhaVisivel = !senhaVisivel
                        edtSenha.inputType = if (senhaVisivel)
                            InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD
                        else
                            InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_PASSWORD

                        edtSenha.typeface = originalTypeface

                        val novoIcone = if (senhaVisivel)
                            R.drawable.ic_visibility else R.drawable.ic_visibility_off

                        edtSenha.setCompoundDrawablesWithIntrinsicBounds(
                            0, 0, novoIcone, 0
                        )
                        edtSenha.setSelection(edtSenha.text?.length ?: 0)
                        return@setOnTouchListener true
                    }
                }
            }
            false
        }


        txtCadastro.setOnClickListener {
            startActivity(Intent(this, CadastroActivity::class.java))
        }


        btnEntrar.setOnClickListener {
            val cpfPreenchido = edtCpf.text?.isNotBlank() == true
            val senhaPreenchida = edtSenha.text?.isNotBlank() == true

            if (!cpfPreenchido || !senhaPreenchida) {
                Toast.makeText(
                    this,
                    "⚠ Por favor, preencha CPF e senha para continuar.",
                    Toast.LENGTH_SHORT
                ).show()
            } else {
                val intent = Intent(this, InicioActivity::class.java)
                startActivity(intent)
                finish()
            }
        }
    }

    // Aplicar máscara de CPF (ARRUMAR!)
    class MaskWatcher(private val mask: String) : TextWatcher {
        private var updating = false
        override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
        override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
        override fun afterTextChanged(s: Editable?) {
            if (updating) return
            val digits = s.toString().filter(Char::isDigit)
            val out = StringBuilder()
            var i = 0
            for (m in mask) {
                if (m == '#') {
                    if (i < digits.length) out.append(digits[i++]) else break
                } else {
                    if (i < digits.length) out.append(m) else break
                }
            }
            updating = true
            s?.replace(0, s.length, out.toString())
            updating = false
        }
    }
}
