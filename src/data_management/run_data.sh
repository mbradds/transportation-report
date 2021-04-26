#!/bin/bash
eval "$(conda shell.bash hook)"
conda activate transportation-report
python src/data_management/to_json.py