#!/bin/bash
DOWNLOAD_URL_PREFIX="https://raw.githubusercontent.com/sensible-hq/sensible-configuration-library/main/" 
LINES=$(find -name "*.*" | grep -v "\/\." | grep ".json\|.pdf\|.png")
CONFIGS=$(echo "$LINES" | grep "config.json")
MANIFEST=$(
for config in $CONFIGS; do
    files=()
    config_path=(${config//\// })
    associated_jsons=$(echo "$LINES" | grep -v "config.json" | grep ".json" | grep "/${config_path[1]}/")

    for json in $associated_jsons; do
        fileName=(${json//\.json/ })
        pdfFile="${fileName}_sample.pdf"
        pngFile="${fileName}_sample.png"
        if grep -q "$pdfFile" <<< "$LINES" && grep -q "$pngFile" <<< "$LINES";
        then
            jsonPath=(${json//\.\// })
            pdfPath=(${pdfFile//\.\// })
            pngPath=(${pngFile//\.\// })
            files+=(
                "{\"path\":\"${jsonPath}\",\"download_url\":\"${DOWNLOAD_URL_PREFIX}${jsonPath}\"}" 
                "{\"path\":\"${pdfPath}\",\"download_url\":\"${DOWNLOAD_URL_PREFIX}${pdfPath}\"}" 
                "{\"path\":\"${pngPath}\",\"download_url\":\"${DOWNLOAD_URL_PREFIX}${pngPath}\"}"
                )
        fi
    done

    primary=$(cat $config | jq -s | jq '.[].featured.primary' | tr -d '"')
    secondary=$(cat $config | jq -s | jq '.[].featured.secondary' | tr -d '"')

    if test ${#primary} -gt 0; then
        primary+='_sample.png'
    else
        primary="n/a"
    fi

    if test ${#secondary} -gt 0; then
        secondary+='_sample.png'
    else
        secondary="n/a"
    fi

    jsonFiles=$(echo "${files[@]}" | jq -r '{path:.path, download_url:.download_url}' | jq -s)

    echo $(
        cat $config | jq -r --arg config_path ${config_path[1]} --argjson jsonFiles "${jsonFiles[@]}" --arg primary $primary --arg secondary $secondary '{
        config_data: {
            path: $config_path,
            category: .category,
            description: .description,
            display_name: .display_name,
            featured: {
                primary: $primary,
                secondary: $secondary
            }
        },
        files: $jsonFiles
    }')
done | jq -s )

