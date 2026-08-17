# Resume source

`Pranav_Arora_Resume.html` is the editable source for the portfolio résumé.

Generate the public PDF on macOS with:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless \
  --disable-gpu \
  --no-pdf-header-footer \
  --allow-file-access-from-files \
  --print-to-pdf=public/Pranav_Arora.pdf \
  "file://$(pwd)/resume/Pranav_Arora_Resume.html"
```

The previous PDF is retained at `resume/archive/Pranav_Arora_before_Inception.pdf`.
