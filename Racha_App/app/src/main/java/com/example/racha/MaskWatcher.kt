package com.example.racha

import android.text.Editable
import android.text.TextWatcher

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
            if (m == '#') { if (i < digits.length) out.append(digits[i++]) else break }
            else { if (i < digits.length) out.append(m) else break }
        }
        updating = true
        s?.replace(0, s.length, out.toString())
        updating = false
    }
}