package com.example.racha

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import android.widget.EditText
import android.widget.ImageButton
import android.widget.RadioGroup
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.racha.data.AppDatabase
import com.example.racha.data.CardEntity
import com.example.racha.data.InvitationEntity
import com.example.racha.data.NotificationEntity
import com.google.android.material.floatingactionbutton.FloatingActionButton
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class CartoesActivity : AppCompatActivity() {
    private lateinit var recyclerCartoes: RecyclerView
    private lateinit var fabNovoCartao: FloatingActionButton
    private lateinit var btnBackToHome: ImageButton
    private lateinit var db: AppDatabase
    private var cpf: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_cartoes)

        recyclerCartoes = findViewById(R.id.recyclerCartoes)
        fabNovoCartao = findViewById(R.id.fabNovoCartao)
        btnBackToHome = findViewById(R.id.btnBackToHome)
        db = AppDatabase.instance(this)

        cpf = intent.getStringExtra("cpf")

        recyclerCartoes.layoutManager = LinearLayoutManager(this)

        if (cpf != null) {
            carregarCartoes()
        }

        fabNovoCartao.setOnClickListener {
            criarNovoCartao()
        }

        btnBackToHome.setOnClickListener {
            val intent = Intent(this, InicioActivity::class.java)
            startActivity(intent)
            finish()
        }
    }

    private fun carregarCartoes() {
        lifecycleScope.launch {
            val cards = db.cardDao().getCardsForUser(cpf!!)
            withContext(Dispatchers.Main) {
                val adapter = CardAdapter(cards) { card ->
                    alocarCartaoAGrupo(card)
                }
                recyclerCartoes.adapter = adapter
            }
        }
    }

    private fun criarNovoCartao() {
        val dialogView = layoutInflater.inflate(R.layout.dialog_create_card, null)
        val radioGroup = dialogView.findViewById<RadioGroup>(R.id.radioGroupType)
        val edtName = dialogView.findViewById<EditText>(R.id.edtCardName)
        val edtValue = dialogView.findViewById<EditText>(R.id.edtCardValue)

        val builder = AlertDialog.Builder(this, R.style.CustomAlertDialog)
            .setView(dialogView)
            .setPositiveButton("Criar", null) // Listener será setado depois para evitar fechamento automático
            .setNegativeButton("Cancelar") { dialogInterface, _ ->
                dialogInterface.dismiss()
            }

        val dialog = builder.create()
        dialog.setOnShowListener {
            dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener {
                val selectedTypeId = radioGroup.checkedRadioButtonId
                if (selectedTypeId == -1) {
                    Toast.makeText(this, "Selecione o tipo", Toast.LENGTH_SHORT).show()
                    return@setOnClickListener
                }
                val type = if (selectedTypeId == R.id.radioUnico) "unico" else "recorrente"
                val name = edtName.text.toString().trim()
                val valueStr = edtValue.text.toString().trim()
                if (name.isEmpty() || valueStr.isEmpty()) {
                    Toast.makeText(this, "Nome e valor obrigatórios", Toast.LENGTH_SHORT).show()
                    return@setOnClickListener
                }
                val value = valueStr.toDoubleOrNull()
                if (value == null) {
                    Toast.makeText(this, "Valor inválido", Toast.LENGTH_SHORT).show()
                    return@setOnClickListener
                }

                lifecycleScope.launch(Dispatchers.IO) {
                    val card = CardEntity(userCpf = cpf!!, name = name, type = type, value = value)
                    db.cardDao().insert(card)
                    val cards = db.cardDao().getCardsForUser(cpf!!)
                    val insertedCard = cards.maxByOrNull { it.id } // Pega o de maior id (último inserido)
                    withContext(Dispatchers.Main) {
                        if (insertedCard != null) {
                            convidarPessoasParaCartao(insertedCard)
                            carregarCartoes()
                        }
                        dialog.dismiss()
                    }
                }
            }
        }

        dialog.show()
    }

    private fun convidarPessoasParaCartao(card: CardEntity) {
        val edtInvite = EditText(this).apply { hint = "CPF ou Email do convidado" }
        val builder = AlertDialog.Builder(this, R.style.CustomAlertDialog)
            .setTitle("Convidar para o Cartão")
            .setView(edtInvite)
            .setPositiveButton("Enviar Convite", null) // Listener será setado depois
            .setNegativeButton("Pular", null)

        val dialog = builder.create()
        dialog.setOnShowListener {
            // Personalizar cor do EditText
            edtInvite.setTextColor(ContextCompat.getColor(this, android.R.color.white))
            edtInvite.setHintTextColor(ContextCompat.getColor(this, android.R.color.darker_gray))

            dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener {
                val identifier = edtInvite.text.toString().trim()
                if (identifier.isEmpty()) {
                    Toast.makeText(this, "Informe CPF ou Email", Toast.LENGTH_SHORT).show()
                    return@setOnClickListener
                }
                lifecycleScope.launch(Dispatchers.IO) {
                    val user = db.userDao().getUserByCpf(identifier) ?: db.userDao().getUserByEmail(identifier)
                    if (user == null) {
                        withContext(Dispatchers.Main) {
                            Toast.makeText(this@CartoesActivity, "Usuário não encontrado", Toast.LENGTH_SHORT).show()
                        }
                        return@launch
                    }
                    val invitation = InvitationEntity(cardId = card.id, inviterCpf = cpf!!, inviteeIdentifier = identifier)
                    db.invitationDao().insert(invitation)
                    val notification = NotificationEntity(
                        userCpf = user.cpf,
                        message = "Você recebeu um convite para o cartão '${card.name}'",
                        relatedId = invitation.id
                    )
                    db.notificationDao().insert(notification)
                    withContext(Dispatchers.Main) {
                        Toast.makeText(this@CartoesActivity, "Convite enviado!", Toast.LENGTH_SHORT).show()
                        dialog.dismiss()
                    }
                }
            }
        }
        dialog.show()
    }

    private fun alocarCartaoAGrupo(card: CardEntity) {
        lifecycleScope.launch(Dispatchers.IO) {
            val groups = db.groupDao().getGroupsForUser(cpf!!)
            withContext(Dispatchers.Main) {
                if (groups.isEmpty()) {
                    Toast.makeText(this@CartoesActivity, "Crie um grupo primeiro", Toast.LENGTH_SHORT).show()
                    return@withContext
                }
                val groupNames = groups.map { it.name }.toTypedArray()
                val builder = AlertDialog.Builder(this@CartoesActivity, R.style.CustomAlertDialog)
                    .setTitle("Alocar a Grupo")
                    .setItems(groupNames) { _, which ->
                        val selectedGroup = groups[which]
                        lifecycleScope.launch(Dispatchers.IO) {
                            db.cardDao().allocateToGroup(card.id, selectedGroup.id)
                            withContext(Dispatchers.Main) { carregarCartoes() }
                        }
                    }

                val dialog = builder.create()
                dialog.show()
            }
        }
    }
}