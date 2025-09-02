package com.example.racha

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.racha.data.CardEntity

class CardAdapter(var cards: List<CardEntity>, private val onCardClick: (CardEntity) -> Unit) : RecyclerView.Adapter<CardAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val textCardName: TextView = view.findViewById(R.id.textCardName)
        val textCardType: TextView = view.findViewById(R.id.textCardType)
        val textCardValue: TextView = view.findViewById(R.id.textCardValue)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_card, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val card = cards[position]
        holder.textCardName.text = card.name
        holder.textCardType.text = "Tipo: ${card.type.capitalize()}"
        holder.textCardValue.text = "Valor: R$ %.2f".format(card.value)
        holder.itemView.setOnClickListener { onCardClick(card) }
    }

    override fun getItemCount() = cards.size
}