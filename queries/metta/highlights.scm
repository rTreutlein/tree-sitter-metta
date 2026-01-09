; --- Primitives ---
(number) @number
(string) @string
(variable) @variable
(comment) @comment

; Parentheses as punctuation
"(" @punctuation.bracket
")" @punctuation.bracket

; All symbols (fallback)
(symbol) @symbol

; Recognize list head position and treat as a callable by default
(list
  head: (atom (symbol) @function.call))

; Special forms / keywords (customize as you wish)
; Mark the head as a keyword if it matches these exact names.
(list
  head: (atom (symbol) @keyword)
  (#any-of? @keyword "if" "match" "case" "let" "let*"))

; Sometimes equality is treated like an operator
; You can give '=' operator scope as well:
(list
  head: (atom (symbol) @operator)
  (#any-of? @operator "=" "+" "==" "-" "*" "/"))

; Example: treat boolean-like symbols specially when they appear anywhere
((symbol) @boolean
  (#any-of? @boolean "True" "False"))
