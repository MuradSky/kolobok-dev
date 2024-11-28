#!/bin/bash

COMPONENT_NAME=$1
COMPONENT_DIR=./src/features/$COMPONENT_NAME

# Create component directory
mkdir -p $COMPONENT_DIR

# Create component file
COMPONENT_NAME=$(echo "$1" | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')

cat <<EOL > $COMPONENT_DIR/$COMPONENT_NAME.tsx
import { memo } from 'react';

import styles from './$COMPONENT_NAME.module.scss';

const $COMPONENT_NAME = () => {
    return (
        <div className={styles.block}>
        </div>
    );
};

export default memo($COMPONENT_NAME);
EOL

# Create SCSS module file
touch $COMPONENT_DIR/$COMPONENT_NAME.module.scss

cat <<EOL > $COMPONENT_DIR/$COMPONENT_NAME.module.scss
.block {

}
EOL

# Create index file
cat <<EOL > $COMPONENT_DIR/index.ts
export { default } from './$COMPONENT_NAME';
EOL

echo "Component $COMPONENT_NAME created successfully!"
