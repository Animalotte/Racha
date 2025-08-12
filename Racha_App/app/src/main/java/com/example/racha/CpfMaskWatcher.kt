package com.example.racha

import android.text.Editable
import android.text.TextWatcher

class CpfMaskWatcher : TextWatcher {
    private var isUpdating = false
    private val mask = "###.###.###-##"

    override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}

    override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}

    override fun afterTextChanged(s: Editable?) {
        if (isUpdating || s == null) return

        isUpdating = true

        val unmasked = s.toString().filter { it.isDigit() }
        var masked = ""
        var i = 0

        for (m in mask) {
            if (m != '#') {
                masked += m
            } else {
                if (i < unmasked.length) {
                    masked += unmasked[i]
                    i++
                } else break
            }
        }

        s.replace(0, s.length, masked)
        isUpdating = false
    }
}