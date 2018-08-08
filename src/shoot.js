export function shoot(entity, addProjectileFunction, createProjectileFunction) {
  shootOnce(entity, addProjectileFunction, createProjectileFunction);
  if (entity.unlockedBottomCannon) {
    const bottomCannon = Object.assign({}, entity, {
      y: entity.y + entity.size,
    });
    shootOnce(bottomCannon, addProjectileFunction, createProjectileFunction);
  }
  if (entity.unlockedTopCannon) {
    const topCannon = Object.assign({}, entity, {
      y: entity.y - entity.size,
    });
    shootOnce(topCannon, addProjectileFunction, createProjectileFunction);
  }
}

function shootOnce(entity, addProjectileFunction, createProjectileFunction) {
  switch (entity.shotType) {
    case "overlap":
      for (let i = 0; i < entity.numberOfProjectiles; i++) {
        addProjectileFunction(createProjectileFunction(entity));
      }
      break;
    case "ball":
      for (let i = 0; i < entity.numberOfProjectiles; i++) {
        addProjectileFunction(
          createProjectileFunction(entity, {
            range: entity.projectileRange / 2,
            size: entity.projectileSize * 4,
          }),
        );
      }
      break;
    case "burst":
      for (let i = 0; i < entity.numberOfProjectiles; i++) {
        addProjectileFunction(
          createProjectileFunction(entity, {
            x: entity.x + i * entity.projectileSize * 2,
          }),
        );
      }
      break;
    case "spread":
      shootSpread(entity, addProjectileFunction, createProjectileFunction);
      break;
    case "side":
      for (let i = 0; i < entity.numberOfProjectiles; i++) {
        addProjectileFunction(
          createProjectileFunction(entity, {
            x: entity.x + (i * entity.size) / 2,
            vx: 0,
            vy: -entity.projectileSpeed,
          }),
        );
        addProjectileFunction(
          createProjectileFunction(entity, {
            x: entity.x + (i * entity.size) / 2,
            vx: 0,
            vy: entity.projectileSpeed,
          }),
        );
      }
      break;
    default:
      shootStandard(entity, addProjectileFunction, createProjectileFunction);
  }
}

function shootStandard(entity, addProjectileFunction, createProjectileFunction) {
  if (entity.numberOfProjectiles % 2 === 0) {
    for (let i = 1; i <= entity.numberOfProjectiles / 2; i++) {
      addProjectileFunction(
        createProjectileFunction(entity, {
          y: entity.y - (entity.size * i) / (entity.numberOfProjectiles / 2 + 1),
        }),
      );
      addProjectileFunction(
        createProjectileFunction(entity, {
          y: entity.y + (entity.size * i) / (entity.numberOfProjectiles / 2 + 1),
        }),
      );
    }
    // 2 : 1/2
    // 4 : 1/3, 2/3
    // 6 : 1/4, 2/4, 3/4
    // 8 : 1/5, 2/5, 3/5, 4/5
  } else {
    // 1
    // 3 : 1/2
    // 5 : 1/3, 2/3
    // 7 : 1/4, 2/4, 3/4
    // 9 : 1/5, 2/5, 3/5, 4/5
    addProjectileFunction(createProjectileFunction(entity));
    for (let i = 1; i <= (entity.numberOfProjectiles - 1) / 2; i++) {
      addProjectileFunction(
        createProjectileFunction(entity, {
          y: entity.y - (entity.size * i) / ((entity.numberOfProjectiles + 1) / 2),
        }),
      );
      addProjectileFunction(
        createProjectileFunction(entity, {
          y: entity.y + (entity.size * i) / ((entity.numberOfProjectiles + 1) / 2),
        }),
      );
    }
  }
}

function shootSpread(entity, addProjectileFunction, createProjectileFunction) {
  switch (entity.numberOfProjectiles) {
    case 1:
      addProjectileFunction(createProjectileFunction(entity));
      break;
    case 2:
      addProjectileFunction(
        createProjectileFunction(entity, {
          y: entity.y - entity.size / 2,
          vy: -entity.projectileSpeed / 12,
        }),
      );
      addProjectileFunction(
        createProjectileFunction(entity, {
          y: entity.y + entity.size / 2,
          vy: entity.projectileSpeed / 12,
        }),
      );
      break;
    case 3:
      addProjectileFunction(
        createProjectileFunction(entity, {
          y: entity.y - entity.size / 2,
          vy: -entity.projectileSpeed / 8,
        }),
      );
      addProjectileFunction(createProjectileFunction(entity));
      addProjectileFunction(
        createProjectileFunction(entity, {
          y: entity.y + entity.size / 2,
          vy: entity.projectileSpeed / 8,
        }),
      );
      break;
    case 4:
      addProjectileFunction(
        createProjectileFunction(entity, {
          y: entity.y - entity.size / 2,
          vy: -entity.projectileSpeed / 8,
        }),
      );
      addProjectileFunction(
        createProjectileFunction(entity, {
          y: entity.y - entity.size / 4,
          vy: -entity.projectileSpeed / 12,
        }),
      );
      addProjectileFunction(
        createProjectileFunction(entity, {
          y: entity.y + entity.size / 4,
          vy: entity.projectileSpeed / 12,
        }),
      );
      addProjectileFunction(
        createProjectileFunction(entity, {
          y: entity.y + entity.size / 2,
          vy: entity.projectileSpeed / 8,
        }),
      );
      break;
    case 5:
    default:
      // TODO
      addProjectileFunction(
        createProjectileFunction(entity, {
          y: entity.y - entity.size / 2,
          vy: -entity.projectileSpeed / 4,
        }),
      );
      addProjectileFunction(
        createProjectileFunction(entity, {
          y: entity.y - entity.size / 4,
          vy: -entity.projectileSpeed / 8,
        }),
      );
      addProjectileFunction(createProjectileFunction(entity));
      addProjectileFunction(
        createProjectileFunction(entity, {
          y: entity.y + entity.size / 4,
          vy: entity.projectileSpeed / 8,
        }),
      );
      addProjectileFunction(
        createProjectileFunction(entity, {
          y: entity.y + entity.size / 2,
          vy: entity.projectileSpeed / 4,
        }),
      );
      break;
  }
}
