// Calculadora CHA₂DS₂-VASc
document.getElementById('cha2ds2Form').addEventListener('submit', function(event) {
    event.preventDefault();

    const chf = parseInt(document.querySelector('[name="chf"]').value);
    const hypertension = parseInt(document.querySelector('[name="hypertension"]').value);
    const ageCha2ds2 = parseInt(document.querySelector('[name="ageCha2ds2"]').value);
    const diabetes = parseInt(document.querySelector('[name="diabetes"]').value);
    const stroke = parseInt(document.querySelector('[name="stroke"]').value);
    const vascular = parseInt(document.querySelector('[name="vascular"]').value);
    const sex = parseInt(document.querySelector('[name="sex"]').value);

    const cha2ds2Score = chf + hypertension + ageCha2ds2 + diabetes + stroke + vascular + sex;
    let riskLevel = '';
    if (cha2ds2Score === 0) riskLevel = 'Baixo risco (nenhum tratamento necessário)';
    else if (cha2ds2Score === 1) riskLevel = 'Risco moderado (considerar anticoagulação)';
    else riskLevel = 'Alto risco (anticoagulação recomendada)';

    document.getElementById('cha2ds2Score').textContent = `Pontuação: ${cha2ds2Score} - ${riskLevel}`;
    document.getElementById('cha2ds2Result').classList.remove('hidden');
});

// Calculadora HAS-BLED
document.getElementById('hasbledForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const uncontrolledHypertension = parseInt(document.querySelector('[name="uncontrolledHypertension"]').value);
    const renal = parseInt(document.querySelector('[name="renal"]').value);
    const liver = parseInt(document.querySelector('[name="liver"]').value);
    const strokeHasbled = parseInt(document.querySelector('[name="strokeHasbled"]').value);
    const bleedingHistory = parseInt(document.querySelector('[name="bleedingHistory"]').value);
    const labileInr = parseInt(document.querySelector('[name="labileInr"]').value);
    const ageHasbled = parseInt(document.querySelector('[name="ageHasbled"]').value);
    const drugs = parseInt(document.querySelector('[name="drugs"]').value);
    const alcohol = parseInt(document.querySelector('[name="alcohol"]').value);

    const hasbledScore = uncontrolledHypertension + renal + liver + strokeHasbled + bleedingHistory + labileInr + ageHasbled + drugs + alcohol;
    let bleedingRisk = hasbledScore >= 3 ? 'Alto risco de sangramento' : 'Baixo risco de sangramento';

    document.getElementById('hasbledScore').textContent = `Pontuação: ${hasbledScore} - ${bleedingRisk}`;
    document.getElementById('hasbledResult').classList.remove('hidden');
});

// Calculadora de Anticoagulantes
document.getElementById('anticoagulantForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const condition = document.getElementById('condition').value;
    const age = parseInt(document.getElementById('age').value);
    const crcl = parseInt(document.getElementById('crcl').value);
    const giBleeding = document.getElementById('giBleeding').value;
    const pregnancy = document.getElementById('pregnancy').value;

    // Obter escores (se calculados)
    const cha2ds2ScoreText = document.getElementById('cha2ds2Score').textContent;
    const hasbledScoreText = document.getElementById('hasbledScore').textContent;
    const cha2ds2Score = cha2ds2ScoreText ? parseInt(cha2ds2ScoreText.split(': ')[1]) : 0;
    const hasbledScore = hasbledScoreText ? parseInt(hasbledScoreText.split(': ')[1]) : 0;

    let suggestion = '';
    let considerations = '';

    if (pregnancy === 'yes') {
        suggestion = 'LMWH (e.g., Enoxaparin)';
        considerations = 'LMWH é preferido em gravidez devido ao perfil de segurança. Evite DOACs e varfarina (risco teratogênico).';
    } else if (condition === 'mechanical' || condition === 'aps') {
        suggestion = 'Varfarina (INR 2.0-3.0 ou superior)';
        considerations = 'DOACs são contraindicados para válvulas mecânicas ou APS de alto risco. Monitore INR regularmente.';
    } else if (crcl < 15) {
        suggestion = 'Varfarina';
        considerations = 'DOACs não são recomendados em insuficiência renal grave (CrCl <15 mL/min). Monitore INR.';
    } else {
        if (giBleeding === 'yes') {
            suggestion = 'Apixaban (dose ajustada)';
            considerations = 'Apixaban tem menor risco de sangramento GI. Evite dabigatran. Considere PPI para proteção gástrica.';
        } else if (hasbledScore >= 3 || age >= 80) {
            suggestion = 'Apixaban (dose ajustada)';
            considerations = 'Apixaban é preferido em idosos ou alto risco de sangramento. Dose reduzida (2.5 mg BID) se aplicável.';
        } else if (crcl >= 15 && crcl < 30) {
            suggestion = 'Apixaban ou Rivaroxaban (dose ajustada)';
            considerations = 'Ajuste de dose necessário. Apixaban (2.5 mg BID) ou rivaroxaban (15 mg diário). Evite dabigatran.';
        } else if (cha2ds2Score >= 2) {
            suggestion = 'DOACs (Apixaban, Rivaroxaban, Dabigatran, ou Edoxaban)';
            considerations = 'DOACs são preferidos em NVAF, AVC, ou VTE. Escolha baseada em preferência do paciente (frequência de dose) e perfil de risco.';
        } else {
            suggestion = 'Nenhum anticoagulante necessário';
            considerations = 'CHA₂DS₂-VASc baixo (0-1). Considere apenas aspirina em casos específicos.';
        }
    }

    document.getElementById('suggestion').textContent = `Sugestão: ${suggestion}`;
    document.getElementById('considerations').textContent = `Considerações: ${considerations}`;
    document.getElementById('result').classList.remove('hidden');
});
