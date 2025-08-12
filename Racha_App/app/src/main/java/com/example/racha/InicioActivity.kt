package com.example.racha

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class InicioActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_inicio)
    }
}

//falta agora as outras telas (CartoesActivity.kt, AmigosActivity.kt, HistoricoActivity.kt),
// ai depois fazer com que os bottoes do inicio activity leve a ela