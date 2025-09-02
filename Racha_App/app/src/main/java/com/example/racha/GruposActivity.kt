package com.example.racha

import android.app.AlertDialog
import android.os.Bundle
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.racha.data.AppDatabase
import com.example.racha.data.GroupEntity
import com.google.android.material.floatingactionbutton.FloatingActionButton
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class GruposActivity : AppCompatActivity() {
    private lateinit var recyclerGrupos: RecyclerView
    private lateinit var fabNovoGrupo: FloatingActionButton
    private lateinit var db: AppDatabase
    private var cpf: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_grupos)

        recyclerGrupos = findViewById(R.id.recyclerGrupos)
        fabNovoGrupo = findViewById(R.id.fabNovoGrupo)
        db = AppDatabase.instance(this)

        cpf = intent.getStringExtra("cpf")

        recyclerGrupos.layoutManager = LinearLayoutManager(this)

        if (cpf != null) {
            carregarGrupos()
        }

        fabNovoGrupo.setOnClickListener {
            val edtName = EditText(this).apply {
                hint = "Nome do Grupo"
                setHintTextColor(android.graphics.Color.RED)
                setTextColor(android.graphics.Color.RED)
                setBackgroundColor(android.graphics.Color.BLACK)
            }

            val dialog = AlertDialog.Builder(this)
                .setTitle("Novo Grupo")
                .setView(edtName)
                .setPositiveButton("Criar") { _, _ ->
                    val name = edtName.text.toString().trim()
                    if (name.isEmpty()) {
                        Toast.makeText(this, "Nome obrigatório", Toast.LENGTH_SHORT).show()
                        return@setPositiveButton
                    }
                    lifecycleScope.launch(Dispatchers.IO) {
                        db.groupDao().insert(GroupEntity(name = name, creatorCpf = cpf!!))
                        withContext(Dispatchers.Main) {
                            carregarGrupos()
                        }
                    }
                }
                .setNegativeButton("Cancelar", null)
                .create()

            dialog.show()

            dialog.window?.setBackgroundDrawableResource(android.R.color.black)

            val titleId = dialog.context.resources.getIdentifier("alertTitle", "id", "android")
            val titleView = dialog.findViewById<android.widget.TextView>(titleId)
            titleView?.setTextColor(android.graphics.Color.RED)

            dialog.getButton(AlertDialog.BUTTON_POSITIVE)?.setTextColor(android.graphics.Color.RED)
            dialog.getButton(AlertDialog.BUTTON_NEGATIVE)?.setTextColor(android.graphics.Color.RED)
        }
    }

    // Função corrigida, declarada fora do onCreate()
    private fun carregarGrupos() {
        lifecycleScope.launch {
            val groups = db.groupDao().getGroupsForUser(cpf!!)
            withContext(Dispatchers.Main) {
                recyclerGrupos.adapter = GroupAdapter(groups)
            }
        }
    }
}
